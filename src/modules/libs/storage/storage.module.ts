import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import {
	FirebaseConfig,
	getFirebaseConfig
} from '@/src/core/config/firebase.config'

import { StorageService } from './storage.service'

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: 'FIREBASE_CONFIG',
			useFactory: async (
				configService: ConfigService
			): Promise<FirebaseConfig> => {
				return await getFirebaseConfig(configService)
			},
			inject: [ConfigService]
		},
		StorageService
	],
	exports: [StorageService]
})
export class StorageModule {}
