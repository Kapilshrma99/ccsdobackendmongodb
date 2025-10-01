export const emailTextfordonationcreation = (body,order) => {

   let emailText = `
New Donation Form created

--- Donor Details ---
Full Name      : ${body.donor.first_name} ${body.donor.last_name}
Email ID       : ${body.donor.email}
Mobile No      : ${body.donor.phone}
razorpay_order_id        : ${order.id}
receipt          : ${order.receipt}
amount           : ${order.amount}
status           : ${order.status}
`;
    return emailText;
}

export const emailTextfordonationverification = (body,order) => {
    let emailText = `
New Donation Form Verification

--- Donor Details ---
Full Name      : ${body.donation_payload.donor.first_name} ${body.donation_payload.donor.last_name}
Email ID       : ${body.donation_payload.donor.email}
Mobile No      : ${body.donation_payload.donor.phone}
razorpay_order_id        : ${order.order_id}
payment_id          : ${order.payment_id}
signature           : ${order.signature}
donation_payload  : ${JSON.stringify(order.donation_payload)}
status           : "paid"
verified_at           : ${order.verified_at}
`;
    return emailText;
}   


export const emailTextforcareer = (body,text) => {
    let emailText = `
New ${text} form on your website

---  Details ---
${body}
`;
    return emailText;
}  