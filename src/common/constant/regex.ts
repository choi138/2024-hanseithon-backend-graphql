// 8자 이상, 숫자 + 특수기호 조합
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

// 한글 2자 ~ 4자 허용
export const NAME_REGEX = /^[가-힣]{2,4}$/;
