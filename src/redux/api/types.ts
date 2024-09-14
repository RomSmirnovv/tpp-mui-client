
export interface UserId {
	_id: string
}

export interface IUser {
	_id?: UserId;
	name: string;
	surname: string;
	patronymic: string;
	login: string;
	password: string;
	role: number;
	birthDate: string;
	phone: string;
}

export interface IGenericResponse {
	status: string;
	message: string;
}

export interface IToken {
	accessToken: string
	accessTokenExpiration: number
}

export interface ListId {
	_id: string
}

export interface IList {
	_id?: string
	name: string
	userId: UserId
	checked: boolean
	order: number
	columns: IColumn[]
}

export interface ColumnId {
	_id: string
}

export interface IColumn {
	_id?: ColumnId
	name: string
	slug: string
	type: string
	width?: number
	key?: number
}

export interface CompanyId {
	_id: string
}

export interface ICompany {
	_id?: string
	name: string
	color: string
	userId: UserId
	favorite: boolean
	delListName: string
	listName: string
	delComment: string
	fileLink: string
	location: string
	person: string
	phone: string
	email: string
	requirement: string
	offer: string
	note: string
	fullName: string
}


export interface NotificationId {
	_id: string
}

export interface INotification {
	_id?: NotificationId
	message: string
	createdDate: string
	notificationDateTime: string
	notificationDate: string
	notificationTime: string
	userId: UserId
	companyId: CompanyId
	readed: boolean
	sended: boolean
}