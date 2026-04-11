import {Router} from 'express'
import multer from 'multer'
import {cloudinary} from '../services/cloudinary.js'

const uploadRoutes = Router()

const upload = multer ({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024}  
})

uploadRoutes.post ('/upload-image', upload.single('file'), async (req ,res )=>{
    try {
        if (!req.file) {
            return res.status(400).json({
            ok: false,
            message: 'You must upload an image to Cloudinary'
            })
        }

        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({
            ok: false,
            message: 'Only image files are allowed'
            })
        }

        const base64 = req.file.buffer.toString('base64')
        const dataUri = `data:${req.file.mimetype};base64,${base64}`

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'shopping-cart',
            resource_type: 'image'
        })

        return res.json({
            ok: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format

        })

    } catch (error) {
        console.error('Error: @@Cloudinary=>', error);
        return res.status(500).json({
            ok: false,
            message: 'Error uploading image to Cloudinary'
        });
    }

})

export default uploadRoutes