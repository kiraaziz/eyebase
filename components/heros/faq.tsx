"use client"
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function Faq() {


    return (
        <div className='max-w-3xl mx-auto mt-12'>
            <Accordion type="single" collapsible>
                {data.map((el, index) => (<AccordionItem className='border border-input bg-muted/20 backdrop-blur-md  mb-2 rounded-md px-4 py-1' value={`${index}`}>
                    <AccordionTrigger>{el.question}</AccordionTrigger>
                    <AccordionContent className='text-foreground/70 px-3'>{el.response}</AccordionContent>
                </AccordionItem>))}
            </Accordion>
        </div>
    )
}


const data = [
    {
        "question": "What is Eyebase?",
        "response": "Eyebase is your all-in-one Backend-as-a-Service solution. It offers instant API endpoints, secure data storage, and powerful CRUD operations, all without complex setup."
    },
    {
        "question": "How secure is my data with Eyebase?",
        "response": "Eyebase uses API keys to protect your data from unauthorized access, ensuring top-notch security for your sensitive information."
    },
    {
        "question": "What is the structure of Eyebase?",
        "response": "Eyebase organizes your data in collections, similar to files in folders, providing a simple and intuitive structure."
    },
    {
        "question": "Can Eyebase store files and images?",
        "response": "Yes, Eyebase provides centralized storage for your files and images, making it easy to manage all your assets in one place."
    },
    {
        "question": "Does Eyebase support analytics?",
        "response": "Absolutely! Eyebase includes analytics features that allow you to monitor user activity with visual insights."
    },
    {
        "question": "How do I get started with Eyebase?",
        "response": "Start building in minutes by setting up collections, obtaining your API key, and managing data through simple requests."
    },
    {
        "question": "Is there a video tutorial for Eyebase?",
        "response": "Yes, you can watch the introductory video to learn more about Eyebase's features and how it works."
    }
]