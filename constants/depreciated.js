isSubscribedForCurrentMonth = (carNo, data) => {
    console.log(carNo);
    let calender = new Date();
    let generateExpiry = new Date(
        calender.getFullYear(),
        calender.getMonth() + 1,
        0
    );
    data.expiryDate =
        generateExpiry.getDate() +
        "/" +
        generateExpiry.getMonth() +
        "/" +
        generateExpiry.getFullYear();

    let packageDetails = this.state.SubsriptionDetails[carNo];
    if (!this.isEmpty(packageDetails)) {
        if (
            packageDetails[calender.getFullYear()] &&
            packageDetails[calender.getFullYear()][calender.getMonth() + 1]
        ) {
            data.subscriptionActive = true;
            let currentMonthSubDetails =
                packageDetails[calender.getFullYear()][calender.getMonth() + 1];
            let userPack = this.state.usersPackages[
                currentMonthSubDetails.PackageID
            ];
            if (!this.isEmpty(userPack)) {
                data.completedCarWashes = currentMonthSubDetails.CarWashDone;
                data.remainingCarWashes =
                    userPack.PackWashes - currentMonthSubDetails.CarWashDone;
            }
        }
    }

    return data;
};