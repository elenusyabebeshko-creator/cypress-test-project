export function uniqueEmail() {
    // унікальний email з префіксом і таймстемпом — щоб уникати колізій між прогонами
    return `elenusyabebeshko+${Date.now()}@gmail.com`;
}

export const validUser = {
    name: 'Elena',
    lastName: 'Bebeshko',
    password: 'Password1234',
};

export const nameValidationCases = [
    { field: 'Name', value: '', expectedError: 'Name required' },
    {
        field: 'Name',
        value: 'E',
        expectedError: 'Name has to be from 2 to 20 characters long',
    },
    {
        field: 'Name',
        value: 'E'.repeat(21),
        expectedError: 'Name has to be from 2 to 20 characters long',
    },
    { field: 'Name', value: 'Elena1', expectedError: 'Name is invalid' },
    //{ field: 'Name', value: 'Ірина', expectedError: 'Name is invalid' },
];

export const lastNameValidationCases = [
    { field: 'Last name', value: '', expectedError: 'Last name required' },
    {
        field: 'Last name',
        value: 'B',
        expectedError: 'Last name has to be from 2 to 20 characters long',
    },
    {
        field: 'Last name',
        value: 'B'.repeat(21),
        expectedError: 'Last name has to be from 2 to 20 characters long',
    },
    {
        field: 'Last name',
        value: 'Бебешко',
        expectedError: 'Last name is invalid',
    },
];

export const emailValidationCases = [
    { field: 'Email', value: '', expectedError: 'Email required' },
    {
        field: 'Email',
        value: 'not-an-email',
        expectedError: 'Email is incorrect',
    },
    { field: 'Email', value: 'test@', expectedError: 'Email is incorrect' },
];

export const passwordValidationCases = [
    { field: 'Password', value: '', expectedError: 'Password required' },
    {
        field: 'Password',
        value: 'short1A',
        expectedError:
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    },
    {
        field: 'Password',
        value: 'nocapitalletter1',
        expectedError:
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    },
    {
        field: 'Password',
        value: 'NOLOWERCASE1',
        expectedError:
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    },
    {
        field: 'Password',
        value: 'Password12345678', //16 chars
        expectedError:
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    },
];
