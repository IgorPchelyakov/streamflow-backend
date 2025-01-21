import { Inject, Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

import { FirebaseConfig } from '@/src/core/config/firebase.config'

@Injectable()
export class StorageService {
	private readonly client: admin.storage.Storage

	public constructor(
		@Inject('FIREBASE_CONFIG')
		private readonly firebaseConfig: FirebaseConfig
	) {
		this.client = this.firebaseConfig.admin.storage()
	}

	async uploadFile(file: Express.Multer.File): Promise<string> {
		const bucket = this.client.bucket()
		const fileUpload = bucket.file(file.originalname)

		try {
			await fileUpload.save(file.buffer, {
				contentType: file.mimetype,
				public: true
			})

			const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
			return publicUrl
		} catch (error) {
			console.error('Error uploading file to Firebase:', error)

			throw new Error('File upload failed')
		}
	}

	async remove(fileName: string): Promise<void> {
		const bucket = this.client.bucket()
		const file = bucket.file(fileName)

		try {
			await file.delete()

			console.log(`File ${fileName} successfully deleted`)
		} catch (error) {
			console.error('Error deleting file from Firebase:', error)

			throw new Error('File deletion failed')
		}
	}
}
