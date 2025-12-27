🎠 BARN v1 - Setup Guide (Windows)
✅ ONE-TIME SETUP (15 minutes)
1️⃣ Open PowerShell
Press the Windows key on your keyboard
Type PowerShell
Click on Windows PowerShell (the blue icon)
A black/blue window will open - this is PowerShell
2️⃣ Install Node.js (if you don't have it)
Check if you have Node.js:

powershell
node --version
If you see a version number (like v18.x.x), skip to step 3.

If you get an error:

Go to https://nodejs.org
Download the LTS version (green button)
Run the installer
Click "Next" until it's done
Close and reopen PowerShell after installation
3️⃣ Create the project folder
Copy and paste these commands one at a time:

powershell
cd C:\Users\YOUR_USERNAME
Replace YOUR_USERNAME with your actual Windows username. To find your username, type echo %USERNAME% in PowerShell.

powershell
mkdir barn-v1
powershell
cd barn-v1
4️⃣ Initialize the project
powershell
npm init -y
This creates a package.json file.

5️⃣ Install dependencies
powershell
npm install dotenv bs58 @solana/web3.js @solana/spl-token
This will take 30-60 seconds. Wait for it to finish.

6️⃣ Create the main script file
powershell
notepad barn_v1.js
In Notepad:

Paste the entire BARN v1 script code (from barn_v1.js)
Press Ctrl + S to save
Close Notepad
7️⃣ Create the configuration file
powershell
notepad .env
In Notepad, paste EXACTLY this:

PHANTOM_PRIVATE_KEY=your_private_key_here
RPC_URL=https://api.mainnet-beta.solana.com
TOKEN_MINT=Bd2wza2Z1EuBD3BgBgpvvVP8FkQ9HX5CiLusKbUKpump
Replace your_private_key_here with your actual Phantom private key:

Open Phantom wallet
Go to Settings → Security & Privacy
Click "Export Private Key"
Enter your password
Copy the key (it's a long string starting with numbers/letters)
Paste it after PHANTOM_PRIVATE_KEY= (no spaces, no quotes)
Example:

PHANTOM_PRIVATE_KEY=9CgAZUGPNaaujQP4wqCL7XMdWnJUTD1iVjHdoDoELbe...
Save (Ctrl + S) and close Notepad.

🚀 HOW TO RUN BARN v1
Every time you want to use BARN v1:

Open PowerShell
Navigate to the folder:
powershell
cd C:\Users\YOUR_USERNAME\barn-v1
Run the program:
powershell
node barn_v1.js
Your wallet address will appear in the menu once connected!

🎯 THE 4 MODES
[1] The Horse Always Wins
Sends 1000 HORSE to all 8 wallets in ONE transaction
Total: 8,000 HORSE tokens
Most cost-efficient option
[2] Pick a Horse
Choose ONE wallet from the list
Send any amount you want to that wallet
[3] Scheduled THAW
Automatically sends 1000 HORSE to all 8 wallets every 2 hours
Press Enter to stop
Press Enter again to return to menu
[4] Mayhem Mode
Sends 50,000 HORSE to all 8 wallets in ONE transaction
Total: 400,000 HORSE tokens
Requires typing "send" to confirm
⚠️ IMPORTANT SECURITY NOTES
NEVER share your .env file - it contains your private key
NEVER share your private key with anyone
Keep your PHANTOM_PRIVATE_KEY secret
The .env file should only exist on your computer
❓ TROUBLESHOOTING
"Wallet not connected"
Make sure you've added your private key to the .env file
Make sure you replaced your_private_key_here with your actual key
Make sure there are no spaces or quotes around your key
"node is not recognized"
You need to install Node.js (see step 2)

"Cannot find module"
Run npm install dotenv bs58 @solana/web3.js @solana/spl-token again

"Invalid private key"
Check your .env file - make sure there are no spaces or quotes around your key
Make sure you copied the entire key from Phantom
Transaction fails
Make sure you have enough SOL for transaction fees (~0.0001 SOL per TX)
Make sure you have enough HORSE tokens in your wallet
🎉 You're Ready!
Run node barn_v1.js and dominate the tracks! 🎠

📋 About Degen Derby & HORSE Tokens
BARN v1 is specifically designed for the Degen Derby ecosystem. It automates HORSE token distribution across multiple wallets in the Degen Derby universe, making it easier to manage your racing stable and participate in the high-stakes world of blockchain horse racing.

Token Address: Bd2wza2Z1EuBD3BgBgpvvVP8FkQ9HX5CiLusKbUKpump

⚡ Quick Reference
File	Purpose
barn_v1.js	Main script file
.env	Your private configuration (NEVER share)
package.json	Project dependencies
Version: 1.0
Platform: Solana
Token: HORSE (Degen Derby)

