// React imports
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
// Component imports
import Avatar from '../../components/Avatar';
// Bootstrap imports
import Media from 'react-bootstrap/Media';
// CSS imports


const Adoptionrequest = (props) => {

    const { 
      profile_id, 
      profile_image, 
      created_at, 
      name,
      phone,
      email,
      adoptionmessage, 
      owner 
    } = props;


  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={45} />
        </Link>
        <Media.Body>
          <span><strong>{owner}, {created_at}</strong> </span>
          <br></br>
          <span>Name: {name}</span>
          <br></br>
          <span>Phone: {phone}</span>
          <br></br>
          <span>Email: {email}</span>
          <br></br>
          <p>{adoptionmessage}</p>
        </Media.Body> 
        
      </Media>
      
    </div>
  )
}

export default Adoptionrequest