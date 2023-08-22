"""changed user table verified and admin to not nullable

Revision ID: c745a2fedc4c
Revises: bd2bb237509b
Create Date: 2023-07-08 15:40:17.366671

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c745a2fedc4c'
down_revision = 'bd2bb237509b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('admin',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
        batch_op.alter_column('verified',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('verified',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
        batch_op.alter_column('admin',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)

    # ### end Alembic commands ###
