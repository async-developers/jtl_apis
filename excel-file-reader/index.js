const reader = require('xlsx')

const file = reader.readFile('./test2.xlsx')

let adultQrCode = []
let childQrCode = []

const sheets = file.SheetNames

for(let i = 0; i < sheets.length; i++){
const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
temp.forEach((res) => {
	if(res["MyKad Adult"]){
		adultQrCode.push(res["MyKad Adult"])
	}
	if(res["MyKad Child/ Senior"]){
		childQrCode.push(res["MyKad Child/ Senior"])
	}
})
}

// Printing data
console.log(adultQrCode, childQrCode)
