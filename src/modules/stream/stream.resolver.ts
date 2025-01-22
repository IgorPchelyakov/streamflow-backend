import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'

import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeInfoStreamInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filter.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from './models/generate-stream-token.model'
import { StreamModel } from './models/stream.model'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	public async findAllStreams(@Args('filters') input: FiltersInput) {
		return this.streamService.findAllStreams(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandoomStreams() {
		return this.streamService.findRandomStreams()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'cahngeInfoStream' })
	public async changeInfoStream(
		@Authorized() user: User,
		@Args('data') input: ChangeInfoStreamInput
	) {
		return this.streamService.changeInfoStream(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeThumnailStream' })
	public async changeThumnailStream(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload
	) {
		return this.streamService.changeThumnailStream(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeThumbnailStream' })
	public async removeThumbnailStream(@Authorized() user: User) {
		return this.streamService.removeThumbnailStream(user)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
		return this.streamService.generateToken(input)
	}
}
