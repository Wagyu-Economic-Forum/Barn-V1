import 'dotenv/config';
import readline from 'readline';
import bs58 from 'bs58';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getMint,
  getAccount
} from '@solana/spl-token';

/* ============================
   CONFIG
============================ */
const RPC_URL = process.env.RPC_URL;
const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT;
const PRIVATE_KEY = process.env.PHANTOM_PRIVATE_KEY;

const WALLETS = [
  { name: 'Tom Lee', address: '4gu7N68d5NDmAiro9jkxKsJiz9Wcy3SgJLKmb5N8tKbF' },
  { name: 'Karma', address: 'sFWtLfQSMe4NfkdHjXuwyp9nrmP1wBXtFC6AA7X2YYk' },
  { name: 'Changpeng', address: 'HZKK1t1AQi13vZNdUbEc2cXXQHbmSzoRmV38iZS6sG3k' },
  { name: 'Bob Lax', address: 'GYVJiWyPg19xxm2zEhVuFTnASioDFRwbPgG2nmVns2tL' },
  { name: 'Ticker Bitcoin', address: 'EXTm5LXX93Exf89J1GhKUZGJKSyfxGYgG2pFDNJStTBP' },
  { name: 'Pump Guy', address: 'D5iWAGcuj3GKt238LNFcYdNm6jJWcBHjvdtE1g8QvZkf' },
  { name: 'Tokabu', address: '6wrb8Yp8hwnHQ8cpSChBbQQ1EFsZr9wTzPCt7gZmdT3L' },
  { name: 'Lil Chiller', address: 'EMP75ckMf4DNhM2iurtUa8urk499nRiNuSQsYcfq7GTV' }
];

/* ============================
   SETUP
============================ */
const connection = new Connection(RPC_URL, 'confirmed');

// Parse private key
let sender = null;
let walletConnected = false;

if (PRIVATE_KEY && PRIVATE_KEY !== 'your_private_key_here') {
  try {
    const decoded = bs58.decode(PRIVATE_KEY);
    if (decoded.length === 64) {
      sender = Keypair.fromSecretKey(decoded);
      walletConnected = true;
    } else if (decoded.length === 32) {
      sender = Keypair.fromSeed(decoded);
      walletConnected = true;
    } else {
      console.error('Invalid private key length:', decoded.length);
    }
  } catch (error) {
    console.error('Error parsing private key:', error.message);
  }
}

const TOKEN_MINT = new PublicKey(TOKEN_MINT_ADDRESS);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let scheduleInterval = null;

/* ============================
   SEND FUNCTION
============================ */
async function sendTokens(amount, wallets, showSavings) {
  if (!walletConnected || !sender) {
    console.log('\x1b[31m❌ Wallet not connected. Please add your private key to .env file.\x1b[0m');
    return;
  }

  try {
    const mintInfo = await getMint(connection, TOKEN_MINT);
    const tokenAmount = BigInt(amount) * BigInt(10 ** mintInfo.decimals);
    
    const senderATA = await getAssociatedTokenAddress(TOKEN_MINT, sender.publicKey, true);
    
    const senderAccount = await getAccount(connection, senderATA);
    const needed = tokenAmount * BigInt(wallets.length);
    if (senderAccount.amount < needed) {
      console.log(`❌ Not enough tokens. Need ${needed / BigInt(10 ** mintInfo.decimals)}, have ${senderAccount.amount / BigInt(10 ** mintInfo.decimals)}`);
      return;
    }
    
    const tx = new Transaction();
    
    for (const w of wallets) {
      const dest = new PublicKey(w.address);
      const destATA = await getAssociatedTokenAddress(TOKEN_MINT, dest, true);
      
      const destInfo = await connection.getAccountInfo(destATA);
      if (!destInfo) {
        tx.add(createAssociatedTokenAccountInstruction(sender.publicKey, destATA, dest, TOKEN_MINT));
      }
      
      tx.add(createTransferInstruction(senderATA, destATA, sender.publicKey, tokenAmount));
    }
    
    const sig = await sendAndConfirmTransaction(connection, tx, [sender], { commitment: 'confirmed' });
    
    const txInfo = await connection.getParsedTransaction(sig, 'confirmed');
    const fee = txInfo?.meta?.fee ? txInfo.meta.fee / 1e9 : 0;
    const total = amount * wallets.length;
    
    console.log('\n\x1b[32m✅ Transaction Confirmed!\x1b[0m');
    console.log(`\x1b[36m🔗 TX:\x1b[0m ${sig}`);
    console.log(`\x1b[33m📊 Sent:\x1b[0m ${total.toLocaleString()} HORSE (${amount.toLocaleString()} × ${wallets.length})`);
    console.log(`\x1b[35m💸 Fee:\x1b[0m ${fee.toFixed(6)} SOL`);
    
    if (showSavings && wallets.length > 1) {
      const saved = (fee * wallets.length) - fee;
      console.log(`\x1b[32m💰 Saved:\x1b[0m ~${saved.toFixed(6)} SOL vs ${wallets.length} separate TXs`);
    }
    console.log('');
  } catch (err) {
    console.log('\x1b[31m❌ Error:\x1b[0m', err.message);
  }
}

/* ============================
   MENU
============================ */
function showMenu() {
  const walletDisplay = walletConnected && sender 
    ? sender.publicKey.toBase58() 
    : '\x1b[31mWallet not connected\x1b[0m';

  console.log(`
\x1b[31m
   ██████╗  █████╗ ██████╗ ███╗   ██╗    ██╗
   ██╔══██╗██╔══██╗██╔══██╗████╗  ██║   ███║
   ██████╔╝███████║██████╔╝██╔██╗ ██║   ╚██║
   ██╔══██╗██╔══██║██╔══██╗██║╚██╗██║    ██║
   ██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝
\x1b[0m
\x1b[33m           🎠  T H E   B A R N  🎠
        ═══════════════════════════════════
          Degen Derby Automation Tool\x1b[0m

\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
\x1b[36m📍 Wallet:\x1b[0m ${walletDisplay}
\x1b[33m🪙 Token:\x1b[0m ${TOKEN_MINT.toBase58()}
\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

  \x1b[37m[1] The Horse Always Wins\x1b[0m
  \x1b[37m[2] Pick a Horse\x1b[0m
  \x1b[37m[3] Scheduled THAW\x1b[0m
  \x1b[37m[4] Mayhem Mode\x1b[0m

  \x1b[37m[0] Exit\x1b[0m

\x1b[33mEnter choice: \x1b[0m`);
  rl.question('', handleChoice);
}

async function handleChoice(choice) {
  if (!walletConnected || !sender) {
    console.log('\x1b[31m❌ Wallet not connected. Please add your private key to .env file and restart.\x1b[0m\n');
    showMenu();
    return;
  }

  const c = choice.trim();
  
  if (c === '1') {
    console.log('🐴 Sending 1000 HORSE to all 8 wallets');
    await sendTokens(1000, WALLETS, true);
    showMenu();
  } 
  else if (c === '2') {
    console.log('\n🎯 Pick a Horse:');
    WALLETS.forEach((w, i) => console.log(`${i + 1}) ${w.name}`));
    rl.question('\nWallet number: ', async (n) => {
      const idx = Number(n) - 1;
      if (idx >= 0 && idx < WALLETS.length) {
        const wallet = WALLETS[idx];
        rl.question('Amount: ', async (amt) => {
          const amount = Number(amt);
          if (amount > 0) {
            console.log(`\n🚀 Sending ${amount.toLocaleString()} HORSE to ${wallet.name}`);
            await sendTokens(amount, [wallet], false);
          } else {
            console.log('❌ Invalid amount');
          }
          showMenu();
        });
      } else {
        console.log('❌ Invalid wallet');
        showMenu();
      }
    });
  } 
  else if (c === '3') {
    console.log('⏱️  Scheduled THAW - Sending 1000 HORSE every 2 hours');
    console.log('⚠️  Press Enter to stop\n');
    
    await sendTokens(1000, WALLETS, true);
    
    scheduleInterval = setInterval(async () => {
      console.log('\n⏱️  Scheduled send...');
      await sendTokens(1000, WALLETS, true);
    }, 2 * 60 * 60 * 1000);
    
    rl.question('', () => {
      if (scheduleInterval) {
        clearInterval(scheduleInterval);
        scheduleInterval = null;
        console.log('⏹️  Stopped');
      }
      rl.question('\nPress Enter for menu...', () => {
        showMenu();
      });
    });
  } 
  else if (c === '4') {
    const warnings = [
      "Mayhem Mode is expensive by design. That's not a bug, it's the feature. Proceed?",
      "This will be very visible. Very fast. And very hard to explain later. Continue?",
      "Mayhem Mode doesn't ask 'how much'. It asks 'are you sure'. You good?"
    ];
    const warning = warnings[Math.floor(Math.random() * warnings.length)];
    
    console.log('\n💥 MAYHEM MODE 💥');
    console.log('⚠️  Sending 50K HORSE to ALL 8 wallets (400K total)\n');
    rl.question(warning + ' (send/cancel): ', async (confirm) => {
      if (confirm.trim().toLowerCase() === 'send') {
        console.log('\n💥 Activating Mayhem Mode');
        await sendTokens(50000, WALLETS, true);
      } else {
        console.log('❌ Cancelled');
      }
      showMenu();
    });
  } 
  else if (c === '0') {
    console.log('👋 Exiting BARN v1');
    if (scheduleInterval) clearInterval(scheduleInterval);
    rl.close();
    process.exit(0);
  } 
  else {
    console.log('❌ Invalid choice');
    showMenu();
  }
}

/* ============================
   START
============================ */
console.clear();
showMenu();