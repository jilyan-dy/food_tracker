"""changed admin to boolean to prevent confusing foreign key

Revision ID: 7b4f0cca89a1
Revises: 4b2d9e733cae
Create Date: 2023-07-07 14:58:43.888182

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '7b4f0cca89a1'
down_revision = '4b2d9e733cae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('household', schema=None) as batch_op:
        batch_op.drop_constraint('household_ibfk_1', type_='foreignkey')
        batch_op.drop_column('adminID')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('admin', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('admin')

    with op.batch_alter_table('household', schema=None) as batch_op:
        batch_op.add_column(sa.Column('adminID', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('household_ibfk_1', 'user', ['adminID'], ['id'])

    # ### end Alembic commands ###
