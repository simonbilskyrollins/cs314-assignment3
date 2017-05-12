ontime <- read.csv('/Users/simonbr/Desktop/cs314/a3/ontime.csv')

airport_delays2 <- aggregate(cbind(CarrierDelay, WeatherDelay, NASDelay,  SecurityDelay, LateAircraftDelay) ~ Origin + Carrier, FUN=sum, data=ontime)

airport_delays2$Origin <- as.character(airport_delays2$Origin)
airport_delays2$Carrier <- as.character(airport_delays2$Carrier)
airport_delays2[with(airport_delays2, order(Origin, Carrier)), ]

airport_delays2 <- airport_delays2[with(airport_delays2, order(Origin, Carrier)), ]
airport_delays2$TotalDelay <- airport_delays2$CarrierDelay + airport_delays2$WeatherDelay + airport_delays2$NASDelay + airport_delays2$SecurityDelay + airport_delays2$LateAircraftDelay
write.csv(airport_delays2, '/Users/simonbr/Desktop/cs314/a3/ontime_by_airport_and_carrier.csv', row.names=FALSE)
