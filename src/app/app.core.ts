export class AppCore{
    /**
     * Cria um nome amigável para a string
     * @static
     * @param {string} name 
     * @returns {string} 
     * @memberof AppSettings
     */
    public static getNiceName(name: string, S: any): string{
        return S(name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/"/g, '')
            .replace(/'/g, '')
			.replace(/[(]/g, '')
            .replace(/[)]/g, '')
            .replace(/\//g, '-')
        )
        .latinise()
        .s;
    }

    /**
     * Valida se um valor é um GUID
     * 
     * @static
     * @param {string} value 
     * @returns {boolean} 
     * @memberof AppSettings
     */
    public static isGuid(value: string): boolean{
        return /^[0-9A-Fa-f]{8}[-]?([[0-9A-Fa-f]{4}[-]?){3}[[0-9A-Fa-f]{12}$/.test(value);
    }

    /**
     * Verifica se uma GUID é nula ou zerada
     * 
     * @static
     * @param {string} value 
     * @returns {boolean} 
     * @memberof AppSettings
     */
    public static isGuidEmpty(value: string): boolean{
        if (value) {
            if (value === '00000000-0000-0000-0000-000000000000'){
                return true;
            }
            else{
                return false;
            }
        }
        return false;
    }

    /**
     * Cria uma GUID
     * 
     * @static
     * @returns 
     * 
     * @memberof AppSettings
     */
    public static createGuid() {
        return (this.S4() + this.S4() + '-' + this.S4() + '-4' + this.S4().substr(0, 3) + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()).toLowerCase();
    }

    private static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }


    /**
     * Verifica se o user agent é mobile
     * 
     * @static
     * @returns {boolean} 
     * 
     * @memberof AppSettings
     */
    public static isMobile(): boolean {
        const ua = window.navigator.userAgent;
        let check = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua)) {
            check = true;
        }

        return check;
    }
}