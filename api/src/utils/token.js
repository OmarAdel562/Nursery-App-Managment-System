import jwt from 'jsonwebtoken'

export const generateToken = ({payload,secretkey ='secretkey'}) =>{
  return  jwt.sign(payload,secretkey)

}

export const verifyToken =({token,secretkey ='secretkey'}) =>{
  try {
    return jwt.verify(token,secretkey)
  } catch (error) {
    return {message:error.message}
    
  }
}