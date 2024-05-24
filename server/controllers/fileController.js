const pool = require('../db');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const {format} = require('util');
const pdfParse = require('pdf-parse');
// const { OpenAIEmbeddings } = require('langchain/embeddings');
const { RecursiveCharacterTextSplitter } =  require('langchain/text_splitter');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { WebPDFLoader } = require('@langchain/community/document_loaders/web/pdf');
const { OpenAIEmbeddings } = require('@langchain/openai');
// const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { DistanceStrategy, PGVectorStore } = require('@langchain/community/vectorstores/pgvector');

require('dotenv').config();


const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(bucketName);

const uploadFileHandler = async (req, res) => {
    const file = req.file;
    const {title, description} = req.body;
    const uniqueFilename = uuidv4();
    
    const embeddings = new OpenAIEmbeddings({
    });

    const config = {
        postgresConnectionOptions: {
          type: "postgres",
          host: "localhost",
          port: 5432,
          user: "postgres",
          password: "1234",
          database: "postgres",
        },
        tableName: "pdfvector",
        columns: {
          idColumnName: "id",
          vectorColumnName: "vector",
          contentColumnName: "content",
          metadataColumnName: "metadata",
        },
        // supported distance strategies: cosine (default), innerProduct, or euclidean
        distanceStrategy: "cosine" ,
      };
      
      const pgvectorStore = await PGVectorStore.initialize(
        embeddings,
        config
      );

    try {
        const blob = bucket.file(uniqueFilename);
        const blobStream = blob.createWriteStream({ 
            metadata : { 
               contentType : 'application/pdf' 
            },
            public:true,
         });
        blobStream.on('error', err => {
            next(err);
        });

        blobStream.on('finish', async() => {
            // The public URL can be used to directly access the file via HTTP.
            const publicUrl = format(
              `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            
            try {
                const insertQuery = 'INSERT INTO pdf (title, description, pdf_url) VALUES($1, $2, $3)';
                const queryResponse = await pool.query(insertQuery, [title, description, publicUrl]);
                
                const response = await fetch(publicUrl);
                const data = await response.blob();

                const loader = new WebPDFLoader(data);
                const docs = await loader.load();
                // console.log(docs);
                
                const splitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 20,
                });

                const splittedPdf = await splitter.splitDocuments(docs);
                console.log(splittedPdf);

                const vectorStore = await pgvectorStore.addDocuments(
                    splittedPdf,
                );

                console.log(vectorStore);
                  
                res.status(200).json({ message: "File uploaded successfully" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to process PDF file" });
            }
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Internal Server Error" });
    }
}


const getAllProjects = async (req, res) => {
    try {
        const projectQuery = 'SELECT * FROM pdf';
        const queryResponse = await pool.query(projectQuery);
        res.status(200).json({ message: "Tables fetched successfully", data: queryResponse });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Internal Server Error" });
    }
}

const generateEmbeddings = async() => {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: "The quick brown fox jumped over the lazy dog",
      encoding_format: "float",
    });
  
    console.log(embedding);
};

module.exports = {uploadFileHandler, getAllProjects};