import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

function Home() {
    const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
    const { isSignedIn, user, isLoaded } = useUser();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function onSelectRole(e) {
        setError('');
        const selectedRole = e.target.value;
        currentUser.role = selectedRole;
        let res = null;
        try {
            if (selectedRole === 'author') {
                res = await axios.post('http://localhost:3000/author-api/author', currentUser);
            }
            if (selectedRole === 'user') {
                res = await axios.post('http://localhost:3000/user-api/user', currentUser);
            }

            if (res && res.data.message === selectedRole) {
                const updatedCurrentUser = res.data.payload;

                let userFromAPI = await axios.get(`http://localhost:3000/admin-api/users-authors`);
                let finalUser = userFromAPI.data.payload.filter((user) => user.email === updatedCurrentUser.email)[0];

                setCurrentUser(finalUser);
                localStorage.setItem('currentuser', JSON.stringify(finalUser));

                if (!finalUser.isActive) {
                    setError('Account blocked. Contact ADMIN');
                } else {
                    if (selectedRole === 'user') {
                        navigate(`/user-profile/${finalUser.email}`);
                    } else if (selectedRole === 'author') {
                        navigate(`/author-profile/${finalUser.email}`);
                    }
                }
            } else if (res) {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            const updatedUser = {
                ...currentUser,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0].emailAddress,
                profileImageUrl: user.imageUrl,
            };
            setCurrentUser(updatedUser);

            axios.get(`http://localhost:3000/admin-api/users-authors`)
                .then((userFromAPI) => {
                    const storedUser = JSON.parse(localStorage.getItem('currentuser'));
                    if(storedUser){
                        let finalUser = userFromAPI.data.payload.filter((user) => user.email === storedUser.email)[0];
                        if (finalUser && finalUser.isActive === false) {
                            setError('Account blocked. Contact ADMIN');
                        } else {
                            setError("");
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [isSignedIn, isLoaded]);

    return (
        <div className='container'>
            {isSignedIn ? (
                <div>
                    <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
                        <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
                        <p className="display-6">{user.firstName}</p>
                        <p className="lead">{user.emailAddresses[0].emailAddress}</p>
                    </div>
                    {error && <p className="text-danger fs-5">{error}</p>}
                    {!error && (
                        <div className='user-info'>
                            <p className="lead">Select role</p>
                            <div className='d-flex role-radio py-3 justify-content-center'>
                                <div className="form-check me-4">
                                    <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
                                    <label htmlFor="author" className="form-check-label">Author</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
                                    <label htmlFor="user" className="form-check-label">User</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='blog-info'>
                    <h1>What is a Blog?</h1>
<p>A blog app is a software application designed to facilitate the creation, management, and publication of blog content. It provides a platform for individuals or groups to share their thoughts, ideas, and information with an audience. </p>
<p>A blog provides a platform to express your thoughts, opinions, and experiences with the world.</p>
<p>A blog can showcase your expertise and skills, establishing you as an authority in your field.</p>
<p>Blogging can be a creative outlet for writing, photography, and other forms of expression.</p>
                </div>
            )}
        </div>
    );
}

export default Home;