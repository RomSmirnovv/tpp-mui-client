import { useEditCompanyMutation } from '../../redux/api/companyApi';
import { ICompany } from '../../redux/api/types';
import styles from './index.module.css';
type Props = {
	user: any
	currentUser: any
	params: any
}
const CompanyRowColors = ({ params, user, currentUser }: Props) => {
	const [editCompany, { isLoading: isEditCompanyLoading }] = useEditCompanyMutation()

	const editColor = async (company: ICompany, color: string) => {
		let updateCompany = { ...company, color }
		if (user._id === currentUser._id) {
			updateCompany.editIsAdmin = false
		} else {
			updateCompany.editIsAdmin = true
		}
		if (company.color === color) {
			updateCompany.color = ''
		}
		try {
			await editCompany(updateCompany).unwrap();
		} catch (error) {
		}
	}
	return (
		// <>{params.row.color}</>
		<>
			<span className={`${styles.color__item} ${styles.color__item__red}`} style={params.row.color === '#ef7575' ? { opacity: 1 } : { opacity: 0.3 }} onClick={() => editColor(params.row, '#ef7575')}></span>
			<span className={`${styles.color__item} ${styles.color__item__yellow}`} style={params.row.color === '#ffe51d' ? { opacity: 1 } : { opacity: 0.3 }} onClick={() => editColor(params.row, '#ffe51d')}></span>
			<span className={`${styles.color__item} ${styles.color__item__green}`} style={params.row.color === '#84d166' ? { opacity: 1 } : { opacity: 0.3 }} onClick={() => editColor(params.row, '#84d166')}></span>
		</>
	);
}

export default CompanyRowColors;