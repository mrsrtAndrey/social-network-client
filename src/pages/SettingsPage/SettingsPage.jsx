import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import {getUser} from "../../store/user/userSlice"
import {authChangeImgUrlAvater} from "../../store/auth/authSlice"
import Loader from '../../components/UI/Loader/Loader'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import {PencilFill} from 'react-bootstrap-icons'
import styles from './SettingsPage.module.scss'
import uploadImg from '../../services/Upload/upload.services'
 

const SettingsPage = () => {
   const dispatch = useDispatch()
   const userAuth = useSelector((state) => state.auth.user);
   const { user } = useSelector((state) => state.user);
   const [discription, setDiscription] = useState(null)
   const [img, setImage] = useState(null)

   useEffect(() => {
      dispatch(getUser(userAuth.userId))
   }, [userAuth.token])

   useEffect(() => {
      setDiscription(user?.discription)
   }, [user])

   const sendApload = useCallback(async () => {
      if(!!img){
         try{
            const res = await uploadImg(img, 'user', 120)
            if(!!res){
               dispatch(authChangeImgUrlAvater(res.data))
               alert("Фото успешно загружено!")
            }
         }catch(err) {
            console.log(err)
            alert("Ошибка загрузки картинки на сервер, попробуйте позже!")
         }
      }
   }, [img])

   return (
      <main className="contant box">
         {user
            ?<div>
               <ul>
                  <li>ID: {user._id}</li>
                  <li>Email: {user.email}</li>
                  <li>Имя: {user.name}</li>
               </ul>
               <form className={styles.form}>
                  <h3>Фото профиля:</h3>
                  <input 
                     className={styles.file} 
                     onChange={e => setImage(e.target.files[0])}
                     type="file"
                  />

                  <h3>Описание:</h3>
                  {discription !== null && discription !== undefined &&
                     <Input onChange={(e)=>setDiscription(e.target.value)} value={discription} icon={<PencilFill/>}/>
                  }
                  <div>
                     <Button onClick={sendApload}  type="fill">Сохранить изменения</Button>
                  </div>
               </form>
            </div>
            :<Loader/>
         }
      </main>
   );
};

export default SettingsPage;