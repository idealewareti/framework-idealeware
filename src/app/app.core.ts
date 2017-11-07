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
}