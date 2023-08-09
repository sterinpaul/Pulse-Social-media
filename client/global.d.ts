import {RecaptchaVerifier} from 'firebase/auth'
// global.d.ts
interface Window {
    recaptchaVerifier: RecaptchaVerifier;
}
export default Window