const pdf = require('html-pdf');

const options = { format: 'A4', quality: "75" };

exports.handler = (event) => {
    console.log(event)
    const {body} = {...event}
    const {htmlFile} = {...JSON.parse(body)}
    console.log(body)
    console.log(htmlFile, htmlFile)
    return pdf.create(htmlFile, options).toBuffer(async function(err, buffer){
        console.log(buffer)
        return buffer
    });
}
