import { useEditCompanyMutation } from '../../redux/api/companyApi';
import { ICompany } from '../../redux/api/types';
import { useGetUserQuery } from '../../redux/api/userApi';
import { useGetWorkspaceQuery, useGetWorkspaceByUserIdQuery } from '../../redux/api/workspaceApi';
import styles from './index.module.css';
type Props = {
	user: any
	currentUser: any
	params: any
}
const CompanyRowColors = ({ params, user, currentUser }: Props) => {
	const [editCompany, { isLoading: isEditCompanyLoading }] = useEditCompanyMutation()
	const { data: currentUserData } = useGetUserQuery(null);
	
	// Получаем workspaceId из пользователя
	const workspaceId = currentUserData?.workspaceId || user?.workspaceId;
	const workspaceIdString = workspaceId && typeof workspaceId === 'object' 
		? (workspaceId._id || workspaceId.toString()) 
		: workspaceId?.toString();
	
	// Получаем workspace по workspaceId, если он есть
	const { data: workspace } = useGetWorkspaceQuery(workspaceIdString || '', { 
		skip: !workspaceIdString 
	});
	
	// Получаем workspace по userId, если workspaceId отсутствует
	const { data: workspaceByUser } = useGetWorkspaceByUserIdQuery(
		currentUserData?._id?._id || currentUserData?._id || user?._id?._id || user?._id || '',
		{ skip: (workspaceIdString || !currentUserData && !user) }
	);
	
	// Используем workspace из любого источника
	const currentWorkspace = workspace || workspaceByUser;
	
	// Получаем цвета из workspace или используем дефолтные
	const colors = currentWorkspace?.colors && currentWorkspace.colors.length > 0 
		? currentWorkspace.colors 
		: ['#ff0000', '#ffff00', '#00ff00']; // Дефолтные: красный, желтый, зеленый
	
	// Получаем текущий цвет строки (может быть индекс или старый hex)
	const currentColorIndex = params.row.color !== undefined && params.row.color !== '' 
		? (typeof params.row.color === 'number' ? params.row.color : getColorIndex(params.row.color, colors))
		: null;
	
	// Функция для получения индекса цвета (для обратной совместимости со старыми hex)
	function getColorIndex(colorValue: string, colorArray: string[]): number | null {
		// Если это уже индекс (число в строке)
		if (!isNaN(Number(colorValue))) {
			return Number(colorValue);
		}
		// Если это hex код, ищем соответствующий индекс
		for (let i = 0; i < colorArray.length; i++) {
			if (colorValue === colorArray[i]) {
				return i;
			}
		}
		// Старые хардкодные цвета для обратной совместимости
		const oldColors: { [key: string]: number } = {
			'#ef7575': 0,
			'#ffe51d': 1,
			'#84d166': 2
		};
		if (oldColors[colorValue]) {
			return oldColors[colorValue];
		}
		return null;
	}

	const editColor = async (company: ICompany, colorIndex: number) => {
		console.log('=== editColor START ===');
		console.log('Company:', company._id);
		console.log('ColorIndex:', colorIndex);
		console.log('CurrentColorIndex:', currentColorIndex);
		console.log('Company color before:', company.color);
		
		let updateCompany = { ...company };
		
		// Если цвет уже установлен, снимаем его
		if (currentColorIndex === colorIndex) {
			updateCompany.color = '';
			console.log('Removing color (already set)');
		} else {
			// Устанавливаем индекс цвета
			updateCompany.color = colorIndex;
			console.log('Setting color to index:', colorIndex);
		}
		
		if (user?._id === currentUser?._id) {
			updateCompany.editIsAdmin = false;
		} else {
			updateCompany.editIsAdmin = true;
		}
		
		console.log('Company data to send:', {
			_id: updateCompany._id,
			color: updateCompany.color,
			editIsAdmin: updateCompany.editIsAdmin
		});
		
		try {
			console.log('Calling editCompany mutation...');
			const result = await editCompany(updateCompany).unwrap();
			console.log('=== editColor SUCCESS ===');
			console.log('Updated company:', result);
			console.log('Updated company color:', result.color);
			console.log('Color type:', typeof result.color);
		} catch (error) {
			console.error('=== editColor ERROR ===');
			console.error('Error:', error);
		}
	}
	
	return (
		<>
			{colors.map((color, index) => (
				<span 
					key={index}
					className={`${styles.color__item}`} 
					style={{
						backgroundColor: color,
						opacity: currentColorIndex === index ? 1 : 0.3
					}} 
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						editColor(params.row, index);
					}}
				></span>
			))}
		</>
	);
}

export default CompanyRowColors;