export const compareRooms = (users, userId) => {
	let rooms: any = [{
		room: ['all', 'chat'],
		name: 'Общий чат',
		active: true
	}]
	if (users && users.length > 0) {
		const roomsDefault = users.map((u) => {
			if (u._id !== userId) {
				return {
					room: [u._id, userId],
					name: u.name + ' ' + u.surname,
					active: false
				}
			}
		})
		rooms = roomsDefault.filter((r) => r != undefined).map((r) => {
			if (r) {
				return {
					...r,
					room: r.room.sort((a, b) => a.localeCompare(b)),
				}
			}
		})
		rooms.unshift({
			room: ['all', 'chat'],
			name: 'Общий чат',
			active: true
		})
	}
	return rooms;
}