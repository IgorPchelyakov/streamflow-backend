import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'
import { initializeApp } from 'firebase/app'
import { readFileSync } from 'fs'

// import serviceAccount from './streamflow-fb-conf.json'
export interface FirebaseConfig {
	client: any
	admin: admin.app.App
}
export async function getFirebaseConfig(
	configService: ConfigService
): Promise<FirebaseConfig> {
	const firebaseClientConfig = {
		apiKey: configService.getOrThrow<string>('FIREBASE_API_KEY'),
		authDomain: configService.getOrThrow<string>('FIREBASE_AUTH_DOMAIN'),
		projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
		storageBucket: configService.getOrThrow<string>(
			'FIREBASE_STORAGE_BUCKET'
		),
		messagingSenderId: configService.getOrThrow<string>(
			'FIREBASE_MESSAGING_SENDER_ID'
		),
		appId: configService.getOrThrow<string>('FIREBASE_APP_ID')
	}
	const serviceAccountPath = configService.get<string>(
		'FIREBASE_ADMIN_CREDENTIAL_PATH'
	)
	const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
	const firebaseAdmin = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		storageBucket: firebaseClientConfig.storageBucket
	})
	const firebaseClient = initializeApp(firebaseClientConfig)
	return {
		client: firebaseClient,
		admin: firebaseAdmin
	}
}
