import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMedium } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const FooterPart = () => (
    <div>
        <footer className='footer'>
            <Nav className="justify-content-center" activeKey="/home">
                <Nav.Item>
                    <Nav.Link href='https://github.com/erenctns' target='_blank' rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} size="2x" /></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='https://www.linkedin.com/in/erenctns/' target='_blank' rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} size="2x" /></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='https://medium.com/@erenctn02' target='_blank' rel="noopener noreferrer"><FontAwesomeIcon icon={faMedium} size="2x" /></Nav.Link>
                </Nav.Item>
            </Nav>
        </footer>
    </div>
)
export default FooterPart;