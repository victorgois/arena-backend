import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", nullable: false })
  date: Date;

  @Column({ nullable: true })
  timeConfirmed: boolean;

  @Column()
  venue: string;

  @Column()
  championship: string;

  @Column("json")
  homeTeam: {
    name: string;
    abbreviation: string;
    logoUrl: string;
  };

  @Column("json")
  awayTeam: {
    name: string;
    abbreviation: string;
    logoUrl: string;
  };

  @Column({ nullable: true })
  homeScore: string;

  @Column({ nullable: true })
  awayScore: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  detailsLink: string;
}

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", nullable: false })
  date: Date;

  @Column()
  venue: string;

  @Column()
  time: string;
  @Column()
  name: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  detailsLink: string;
}
