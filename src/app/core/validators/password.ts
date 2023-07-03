import { AbstractControl } from "@angular/forms";

interface HasTwoNumbersError {
    dontHasTwoNumbers: boolean
}

interface IsBetweenIntervalError {
    dontIsBetweenInterval: boolean
}

interface HasCrescentDigitsError {
    dontHasCrescentDigits: boolean
}

export class PasswordValidators {
    static hasTwoNumbers(control: AbstractControl): HasTwoNumbersError | null {
        if(!control.value) return null;
        let lastNumber;
        
        for(let number of control.value) {
            if(number === lastNumber) return null
            lastNumber = number;
        }

        return {
            dontHasTwoNumbers: true
        };
    }

    static isBetweenInteval(control: AbstractControl): IsBetweenIntervalError | null {
        const openIntervalNumber: number = 184759;
        const closeIntervalNumber: number = 856920;
        const controlValueAsNumber: number = Number.parseInt(control.value);

        if(controlValueAsNumber < openIntervalNumber ||
            controlValueAsNumber > closeIntervalNumber) {
            return {
                dontIsBetweenInterval: true
            }
        }

        return null;
    }

    static hasCrescentDigits(control: AbstractControl): HasCrescentDigitsError | null {
        let lastNumber = -Infinity;

        for(let numberString of control.value) {
            const number = Number(numberString)

            if(number < lastNumber) return {
                dontHasCrescentDigits: true
            }

            lastNumber = number;
        }
        
        return null;
    }
}
