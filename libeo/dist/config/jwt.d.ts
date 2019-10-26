interface JWTConfig {
    secretOrPrivateKey: string;
    signOptions: object;
}
declare const jwtConfig: JWTConfig;
export default jwtConfig;
