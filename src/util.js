import numeral from 'numeral'

//pretty numbers
export const prettyPrintStat = (stat) => (
    stat ? `+${numeral(stat).format('0.0a')}` : 'No report'
)
