export async function uploadImage(file){
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch('http://localhost:4050/api/images/upload-image', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    if(!res.ok){
        throw new Error(data.message || "Server error");
    }
    return data
}