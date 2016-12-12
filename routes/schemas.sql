ALTER TABLE Competes_In
ADD FOREIGN KEY (athlete_name)
REFERENCES Athlete (name);
