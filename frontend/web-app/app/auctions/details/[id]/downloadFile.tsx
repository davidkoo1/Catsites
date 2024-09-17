  export async function downloadFile(id: string) {
    const fileUrl = `http://localhost:6001/auctions/export/${id}`;
    const response = await fetch(fileUrl);
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
        
    const link = document.createElement('a');
    link.href = url;
    link.download = 'auction';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); 
  }