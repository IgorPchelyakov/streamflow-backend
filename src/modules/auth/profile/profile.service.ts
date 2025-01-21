import { ConflictException, Injectable } from '@nestjs/common'
import * as Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'

import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../../libs/storage/storage.service'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.username}.webp`

		const multerFile = {
			fieldname: 'avatar',
			originalname: fileName,
			encoding: '7bit',
			mimetype: 'image/webp',
			buffer,
			size: buffer.length
		} as Express.Multer.File

		if (file.fileName && file.fileName.endWith('.gif')) {
			const proccessedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.storageService.uploadFile({
				...multerFile,
				buffer: proccessedBuffer
			})
		} else {
			const proccessedBuffer = await sharp(buffer)
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.storageService.uploadFile({
				...multerFile,
				buffer: proccessedBuffer
			})
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: fileName
			}
		})
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) {
			return
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: null
			}
		})

		return true
	}

	public async changeProfileInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input

		const usernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (usernameExists && username !== user.username) {
			throw new ConflictException('This username is already taken')
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				username,
				displayName,
				bio
			}
		})

		return true
	}
}
