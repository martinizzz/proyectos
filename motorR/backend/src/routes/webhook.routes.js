import 'dotenv/config'
import express from "express";
import {Router} from "express";
import { stripe } from "../services/stripe.js";
import { db } from "../services/firebase.js";

const webhookRoutes=Router()
webhookRoutes.post('/stripe', 
    express.raw({type:'application/json'}),
    async(req, res)=>{
        const signature = req.headers['stripe-signature']
        let event
        try {
            event = stripe.webhooks.constructEvent(
                req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`)
        }
        
        try{
            if (event.type === 'checkout.session.completed'){
                const session = event.data.object
                const orderId = session.metadata.orderId
                if (orderId){
                    await db.collection('orders').doc(orderId).update({
                        status: 'paid',
                        paymentStatus: session.payment_status || 'paid',
                        stripeSessionId: session.id,
                        stripeCustomerEmail: session.customer_details?.email || null,
                        paidAt: new Date(),
                        updateAt: new Date()
                    })
                }
            }
            if (event.type === 'checkout.session.expired'){
                const session = event.data.object
                const orderId = session.metadata.orderId
                if (orderId){
                    await db.collection('orders').doc(orderId).update({
                        status: 'expired',
                        paymentStatus: session.payment_status  || 'unpaid',
                        updateAt: new Date()
                    })
                }

            } 
         return res.json({received: true}) 
        }catch(error){
            return res.status(500). json({
                ok:false,
                message:'Error al procesar el webhook',
                
            })
        }
    })

export default webhookRoutes;