import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { Stream } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'
import { ChatMessageModel } from '../../chat/models/chat-message.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	title: string

	@Field(() => String, { nullable: true })
	public thumbnailUrl: string

	@Field(() => String, { nullable: true })
	public ingressId: string

	@Field(() => String, { nullable: true })
	public serverUrl: string

	@Field(() => String, { nullable: true })
	public streamKey: string

	@Field(() => Boolean)
	public isLive: boolean

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date

	@Field(() => CategoryModel)
	category: CategoryModel

	@Field(() => String)
	categoryId: string

	@Field(() => Boolean)
	isChatEnabled: boolean

	@Field(() => Boolean)
	isChatFollowersOnly: boolean

	@Field(() => Boolean)
	isChatPremiumFollowersOnly: boolean

	@Field(() => [ChatMessageModel])
	public chatMessages: ChatMessageModel[]
}
