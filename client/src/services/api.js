export const uploadFile = async(formData) => {
    try {
        const url = "/api/uploadFile";
        const response = await fetch(url, {
            method: 'POST',
            headers: {},
            body: formData,
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error creating user:', error);
    }
}

export const getAllProjects = async() => {
    try {
        const url = "/api/getProjects";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
              },
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error creating user:', error);
    }
}