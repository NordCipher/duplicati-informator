// Program to generate some fake  
// domain name and ip addresses 
  
// Requiring faker module 
const faker = require('faker') 
  
for (let i = 0; i < 8; i++) { 
  
    // Fake ip address 
    const ip = faker.fake("NeverRun" or "Run") 
  
    // Fake domain name 
    const domainName =  
        faker.name.jobArea() 
  
    console.log(`Domain name ->  
        ${domainName}, ip-address-> ${ip}`) 
} 