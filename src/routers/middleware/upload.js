const chalk = require('chalk')
const multer = require('multer')

const setUp = {

    getFileUploadDir() {
        return 'public/upload'
    },
    getFileExtensions() {
        return '\.(jpeg|jpg|png|bmp|tiff)$'
    }
}

const multerUpload = multer({
    //dest : setUp.getFileUploadDir(), not needed when saving image to as a blob
    limits: {
        fieldSize : 4000000 // 4MB
    },
    fileFilter(req, file, cb) {

        const fileName = file.originalname.toLocaleLowerCase()
        const extensions = new RegExp(setUp.getFileExtensions())

        if (!fileName.match(extensions)) {  
            console.log(chalk.blue('Uploading filename :' + fileName))
            cb(new Error('File extension is not supported'))                
        }

        cb(undefined, true)
    }
})


module.exports = multerUpload