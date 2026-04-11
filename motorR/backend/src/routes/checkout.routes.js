import { Router } from "express";
import { stripe } from "../services/stripe.js";
import { db } from "../services/firebase.js";

const router=Router()


router.post('/create-session', async(req, res)=>{
    try {
        const {items}=req.body
        if(!Array.isArray(items) || items.length===0){
        return res.status(400).json({
            ok:false,
            message:'NO hay items para pagar'
        })              
        }
    
        const normalizeItems=items.map((item) =>({
            id:String(item.id),
            name:String(item.name),
            price:Number(item.price),
            qty:Number(item.qty),
            imageUrl:(item.imageUrl ? String(item.imageUrl) : '')
        }))

        for(const item of normalizeItems){
            if(!item.name || !item.price || !item.qty){
                return res.status(400).json({
                    ok:false,
                    message:'LOs items son invalidos'
                })              
            }
        }

    const total=normalizeItems.reduce((acc,item)=>{
        return acc + item.price*item.qty
    },0) 


    const order=db.collection('orders').doc()


    await order.set({
        status:'pending', 
        currency:'mxn', 
        total, 
        items: normalizeItems, 
        stripeSessionId:null, 
        paymentStatus: 'unpaid', 
        createdAt: new Date(), 
        updateAt: new Date()
    })

    const session= await stripe.checkout.sessions.create({
        mode: 'payment', 
        line_items:normalizeItems.map((item)=> ({
            quantity: item.qty, 
            price_data:{
                currency:'mxn', 
                unit_amount: Math.round(item.price*100), 
                product_data:{
                    name:item.name, 
                    images: (item.imageUrl ? (item.imageUrl) : [])
                }
            }
        })),
        success_url: `${process.env.CORS_ORIGIN}/success.html?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.CORS_ORIGIN}/cancel.html?orderId=${order.id}`, 
        metadata:{
            orderId:order.id
        }

    })


    await order.update({
        stripeSessionId: session.id, 
        updateAt: new Date()
    })

    return res.json({
        ok:true, 
        url: session.url,
        orderId: order.id, 
        sessionId: session.id 
        
    })


    } catch (error) {
     return res.status(500).json({
        ok:false,
        message:'Error al procesar el pago, no tienes fondos'
     })   
    }
})

export default router