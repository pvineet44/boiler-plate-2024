import nodemailer from "nodemailer";
import { prisma } from "../db";

interface MailObject {
  to: string[];
  cc?: string[];
  subject: string;
  body?: string;
  type: string;
  html: any;
  order_id: number | null | any;
  teen_detail_id: number | null | any;
  invoice_id: number | null | any;
}
const validateEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validateEmailData = (data: MailObject): void => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid email data format. Please provide an object.");
    }
    if (!data.to || !Array.isArray(data.to) || data.to.length === 0) {
      throw new Error(
        'Invalid "to" field. Please provide a non-empty array of recipient emails.'
      );
    }
    for (const email of data.to) {
      if (!validateEmail(email)) {
        throw new Error(`Invalid email "${email}" found in "to" list.`);
      }
    }
    if (data.cc && (!Array.isArray(data.cc) || data.cc.length === 0)) {
      throw new Error(
        'Invalid "cc" field. If provided, it should be an array of recipient emails.'
      );
    }
    if (data.cc) {
      for (const email of data.cc) {
        if (!validateEmail(email)) {
          throw new Error(`Invalid email "${email}" found in "cc" list.`);
        }
      }
    }
    if (typeof data.subject !== "string" || typeof data.html !== "string") {
      throw new Error("Invalid subject or body format. Both must be strings.");
    }
  };
  const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      from: process.env.NODEMAILER_USER,
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    return transporter;
  };
  export const sendMail = async (data: MailObject) => {
    try {
    //   validateEmailData(data);
      const emailTransporter = await createTransporter();
     let sentMail = await emailTransporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: data.to.join(","),
        cc: data.cc ? data.cc.join(",") : undefined,
        subject: data.subject.toString(),
        html: data.html,
      });
      return sentMail;
    }catch(error: Error | any){
        throw new Error(
            `Error sending email: ${error?.message ?? "Unknown error."}`
          );
    }
}