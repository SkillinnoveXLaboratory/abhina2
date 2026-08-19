import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  const possiblePaths = [
    path.join(__dirname, '../src/config/service-key.json'),
    path.join(__dirname, 'src/config/service-key.json'),
    path.join(process.cwd(), 'server/src/config/service-key.json'),
    path.join(process.cwd(), 'src/config/service-key.json'),
  ];

  let serviceAccountPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      serviceAccountPath = p;
      break;
    }
  }

  if (!serviceAccountPath) {
    console.error('❌ Service key not found in any expected location.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  const app = initializeApp({ credential: cert(serviceAccount) });
  const messaging = getMessaging(app);

  console.log('--------------------------------------------------');
  console.log('1. Sending Text-Based Notification...');
  console.log('--------------------------------------------------');

  const textPayload = {
    notification: {
      title: 'Heartfelt Thanks for Your Support! 🙏',
      body: 'Thank you for being part of ABHINA Charitable Trust in our mission to give hope.',
    },
    topic: 'all',
    android: {
      priority: 'high' as const,
      notification: {
        sound: 'default',
        channelId: 'abhina_trust_v2',
        visibility: 'public' as const,
        defaultVibrateTimings: true,
        defaultLightSettings: true,
      },
    },
  };

  const res1 = await messaging.send(textPayload);
  console.log('✅ Text notification sent successfully! Message ID:', res1);

  console.log('\n⏳ Waiting 10 seconds before sending Image-Based Notification...\n');
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log('--------------------------------------------------');
  console.log('2. Sending Image-Based Notification...');
  console.log('--------------------------------------------------');

  const imageUrl = 'https://images.unsplash.com/photo-1532629345422-7515fe01108c?w=800';

  const imagePayload = {
    notification: {
      title: 'New Welfare Program Launched! 🌟',
      body: 'Check out our latest community initiative and join us in making a difference.',
      imageUrl: imageUrl,
    },
    topic: 'all',
    android: {
      priority: 'high' as const,
      notification: {
        imageUrl: imageUrl,
        sound: 'default',
        channelId: 'abhina_trust_v2',
        visibility: 'public' as const,
        defaultVibrateTimings: true,
        defaultLightSettings: true,
      },
    },
  };

  const res2 = await messaging.send(imagePayload);
  console.log('✅ Image notification sent successfully! Message ID:', res2);
  console.log('--------------------------------------------------');
}

main().catch((err) => {
  console.error('❌ Error sending notification:', err);
  process.exit(1);
});
