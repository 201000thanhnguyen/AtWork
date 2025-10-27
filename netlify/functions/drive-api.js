const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json', // Netlify sẽ cần upload file này
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

exports.handler = async function(event) {
  const method = event.httpMethod;
  const fileId = event.queryStringParameters?.id;

  if(method === 'GET') {
    // đọc file JSON
    const res = await drive.files.get({ fileId, alt: 'media' });
    return { statusCode: 200, body: JSON.stringify(res.data) };
  } else if(method === 'POST') {
    // tạo file mới
    const data = JSON.parse(event.body);
    const fileMetadata = { name: data.name, parents: ['17OD-nI3Aklklmn9bq1yux-xamD97xkQh'] };
    const media = { mimeType: 'application/json', body: JSON.stringify(data.content) };
    const res = await drive.files.create({ resource: fileMetadata, media });
    return { statusCode: 200, body: JSON.stringify(res.data) };
  } else if(method === 'PUT') {
    // update file
    const data = JSON.parse(event.body);
    const media = { mimeType: 'application/json', body: JSON.stringify(data.content) };
    const res = await drive.files.update({ fileId, media });
    return { statusCode: 200, body: JSON.stringify(res.data) };
  } else if(method === 'DELETE') {
    await drive.files.delete({ fileId });
    return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
  }
  return { statusCode: 400, body: 'Invalid method' };
};
