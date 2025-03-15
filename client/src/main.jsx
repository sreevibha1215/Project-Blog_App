import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,Navigate, RouterProvider} from 'react-router-dom';
import Rootlayout from './components/user/Rootlayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import AuthorProfile from './components/author/AuthorProfile.jsx';
import Articles from './components/common/Articles.jsx';
import ArticleById from './components/common/ArticleById.jsx';
import PostArticle from './components/author/PostArticle.jsx';
import UserAuthorContext from './contexts/UserAuthorContext.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

const browserRouterObj= createBrowserRouter([
  {
    path:"/",
    element:<Rootlayout />,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"signin",
        element:<Signin/>
      },
      {
        path:'signup',
        element: <Signup/>
      },
      {
        path:"user-profile/:email",
        element:<UserProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticleById/>

          },
          
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]

      },
      {
        path:"author-profile/:email",
        element:<AuthorProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticleById/>

          },
          {
            path:"article",
            element:<PostArticle/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboard />
    }
      
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
             <RouterProvider router={browserRouterObj} />
    </UserAuthorContext>
  </StrictMode>,
)
