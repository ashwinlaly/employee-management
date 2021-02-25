const createAccount = (username, password) => {
    return (
        `<table>
            <tr>
                <td>Username</td>
                <td>${username}</td>
            </tr>
            <tr>
                <td>password</td>
                <td>${password}</td>
            </tr>
        </table>`
    )
}

const applyForLeave = ({from_date, to_date, reason}) => {
    return (
        `<table>
            <tr>
                <td>From: </td>
                <td>${from_date}</td>
            </tr>
            <tr>
                <td>To: </td>
                <td>${to_date}</td>
            </tr>
            <tr>
                <td>Reason: </td>
                <td>${reason}</td>
            </tr>
            <tr>
                <td>Status: </td>
                <td>Un Approved</td>
            </tr>
        </table>`
    )
}

const employeeAppliedForLeave = ({user_name, from_date, to_date, reason}) => {
    return (
        `<table>
            <tr>
                <td>User: </td>
                <td>${user_name}</td>
            </tr>
            <tr>
                <td>Leave Applied : </td>
                <td>${from_date} - ${to_date}</td>
            </tr>
            <tr>
                <td>Reason: </td>
                <td>${reason}</td>
            </tr>
        </table>`
    )
}

const approvedLeave = ({from_date, to_date, reason}) => {
    return (
        `<table>
            <tr>
                <td>Leave Applied : </td>
                <td>${from_date} - ${to_date}</td>
            </tr>
            <tr>
                <td>Reason : </td>
                <td>${reason}</td>
            </tr>
            <tr>
                <td>Status : </td>
                <td>Approved</td>
            </tr>
        </table>`
    )
}


module.exports = {
    createAccount,
    applyForLeave,
    approvedLeave,
    employeeAppliedForLeave
}