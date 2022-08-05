const fs = require('fs');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '10UHInXOKopgx1W7u4qFQbyh3jkm7-Q_F';

async function uploadFile(){
  try{
      const auth = new google.auth.GoogleAuth({
          keyFile: './googledrive.json',
          scopes: ['https://www.googleapis.com/auth/drive']
      })

      const driveService = google.drive({
          version: 'v3',
          auth
      })

      const fileMetaData = {
          'name': 'nomedorquivo.pdf',
          'parents': [GOOGLE_API_FOLDER_ID]
      }

      const media = {
          //mimeType: 'image/jpg',
          //mimeType: 'image/png',
          mimeType: 'application/pdf',
          body: fs.createReadStream('./arquivo.pdf')
      }

      const response = await driveService.files.create({
          resource: fileMetaData,
          media: media,
          field: 'id'
      })
      return response.data.id

  }catch(err){
      console.log('Upload file error', err)
  }
}

uploadFile().then(data => {
  console.log(data)
  //https://drive.google.com/uc?export=view&id=
});