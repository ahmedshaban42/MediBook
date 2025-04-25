import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';


export const generatePDF = async (html, filename = 'prescription.pdf') => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.resolve(`uploads/${filename}`);
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    console.log(pdfPath)
    return pdfPath;

};
