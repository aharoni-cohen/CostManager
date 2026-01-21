const axios = require('axios');

async function createUser() {
    const url = 'http://localhost:3002/api/users/add';

    const userData = {
        id: 123123,
        first_name: "Moshe",
        last_name: "Cohen",

        birthday: "1990-01-01"
    };

    try {
        console.log(`⏳ מנסה ליצור משתמש בכתובת: ${url}...`);

        const response = await axios.post(url, userData);

        console.log("✅ הצלחה! המשתמש נוצר במסד הנתונים.");
        console.log("פרטים:", response.data);

    } catch (error) {
        console.log("❌ שגיאה ביצירת משתמש:");
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Message:`, error.response.data);
        } else {
            console.log(error.message);
        }
    }
}
createUser();//d
