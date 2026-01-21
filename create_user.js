const axios = require('axios');

async function createUsers() {
    const url = 'http://localhost:3002/api/users/add';

    // מערך של כל המשתמשים שאתה רוצה ליצור
    const usersToCreate = [
        {
            id: 123123,
            first_name: "Moshe",
            last_name: "Cohen",
            birthday: "1990-01-01"
        },
        {
            id: 1231234, // שים לב שה-ID שונה, זה מצוין
            first_name: "Eden",
            last_name: "Aharoni",
            birthday: "1995-05-05"
        }
    ];

    // לולאה שעוברת משתמש-משתמש
    for (const user of usersToCreate) {
        try {
            console.log(`⏳ מנסה ליצור את ${user.first_name} (${user.id})...`);

            const response = await axios.post(url, user);

            console.log(`✅ ${user.first_name} נוצר בהצלחה!`);

        } catch (error) {
            console.log(`❌ שגיאה ביצירת ${user.first_name}:`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Message:`, error.response.data);
            } else {
                console.log(`   ${error.message}`);
            }
        }
        console.log("------------------------------------------------");
    }
}

createUsers();