import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import * as bcrypt from  'bcrypt'

@Injectable()
export class UsersRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        //hash
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log('salt', salt)
        console.log('hashed password', hashedPassword)

        const user = this.create({ username, password: hashedPassword});

        try {
            await this.save(user)
        } catch (err) {
            console.log(err.code)
            if (err.code === '23505') { //duplicate username
                throw new ConflictException('Username already exists');
            }else{
                throw new InternalServerErrorException();
            }

        }

    }



}